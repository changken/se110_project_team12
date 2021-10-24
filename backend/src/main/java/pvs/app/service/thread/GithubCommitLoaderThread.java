package pvs.app.service.thread;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import pvs.app.dto.GithubCommitDTO;
import pvs.app.service.GithubCommitService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * //
 */
public class GithubCommitLoaderThread extends Thread {
    static final Logger logger = LogManager.getLogger(GithubCommitLoaderThread.class.getName());

    private static final Object lock = new Object();
    private final GithubCommitService githubCommitService;
    private final String repoOwner;
    private final String repoName;
    private final String cursor;
    private final WebClient webClient;

    public GithubCommitLoaderThread(WebClient webClient, GithubCommitService githubCommitService, String repoOwner, String repoName, String cursor) {
        this.githubCommitService = githubCommitService;
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.cursor = cursor;
        this.webClient = webClient;
    }

    @Override
    public void run() {
        Map<String, Object> graphQlQuery = new HashMap<>();
        graphQlQuery.put("query", "{repository(owner: \"" + this.repoOwner + "\", name:\"" + this.repoName + "\") {" +
                "defaultBranchRef {" +
                    "target {" +
                        "... on Commit {" +
                            "history (last:100, before: \"" + this.cursor + "\") {" +
                                "nodes {" +
                                        "committedDate\n" +
                                        "additions\n" +
                                        "deletions\n" +
                                        "changedFiles\n" +
                                        "author {" +
                                            "email\n" +
                                            "name\n" +
                                        "}" +
                                    "}" +
                                "}" +
                            "}" +
                        "}" +
                    "}" +
                "}}");

        String responseJson = Objects.requireNonNull(this.webClient.post()
                .body(BodyInserters.fromObject(graphQlQuery))
                .exchange()
                .block())
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();

        try {
            Optional<JsonNode> commits = Optional.ofNullable(mapper.readTree(responseJson))
                    .map(resp -> resp.get("data"))
                    .map(data -> data.get("repository"))
                    .map(repo -> repo.get("defaultBranchRef"))
                    .map(branch -> branch.get("target"))
                    .map(tag -> tag.get("history"))
                    .map(hist -> hist.get("nodes"));

            commits.ifPresent(jsonNode -> jsonNode.forEach(entity -> {
                GithubCommitDTO githubCommitDTO = new GithubCommitDTO();
                githubCommitDTO.setRepoOwner(repoOwner);
                githubCommitDTO.setRepoName(repoName);
                githubCommitDTO.setAdditions(Integer.parseInt(entity.get("additions").toString()));
                githubCommitDTO.setDeletions(Integer.parseInt(entity.get("deletions").toString()));
                githubCommitDTO.setCommittedDate(entity.get("committedDate"));
                githubCommitDTO.setAuthor(Optional.ofNullable(entity.get("author")));

                synchronized (lock) {
                    githubCommitService.save(githubCommitDTO);
                }
            }));
        } catch (IOException e) {
            Thread.currentThread().interrupt();
        }
    }
}
