package pvs.app.service.thread;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.reactive.function.client.WebClient;
import pvs.app.dto.GithubIssueDTO;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class GithubIssueLoaderThread extends Thread {

    private static final Object lock = new Object();
    static final Logger logger = LogManager.getLogger(GithubIssueLoaderThread.class.getName());

    private final List<GithubIssueDTO> githubIssueDTOList;
    private final String repoOwner;
    private final String repoName;
    private final WebClient webClient;
    private final int page;


    public GithubIssueLoaderThread(List<GithubIssueDTO> githubIssueDTOList, String repoOwner, String repoName, int page) {
        String token = System.getenv("PVS_GITHUB_TOKEN");
        this.webClient = WebClient.builder().baseUrl("https://api.github.com/repos")
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
        this.githubIssueDTOList = githubIssueDTOList;
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.page = page;
    }

    @Override
    public void run() {
        String responseJson = Objects.requireNonNull(this.webClient.get()
                .uri("/" + this.repoOwner + "/" + this.repoName + "/issues?page=" + this.page + "&per_page=100&state=all")
                .exchange()
                .block())
                .bodyToMono(String.class)
                .block();
        ObjectMapper mapper = new ObjectMapper();

        try {
            Optional<JsonNode> issueList = Optional.ofNullable(mapper.readTree(responseJson));
            issueList.ifPresent(jsonNode -> jsonNode.forEach(entity -> {
                GithubIssueDTO githubIssueDTO = new GithubIssueDTO();
                githubIssueDTO.setRepoOwner(repoOwner);
                githubIssueDTO.setRepoName(repoName);
                githubIssueDTO.setCreatedAt(entity.get("created_at"));
                githubIssueDTO.setClosedAt(entity.get("closed_at"));

                synchronized (lock) {
                    githubIssueDTOList.add(githubIssueDTO);
                }
            }));
        } catch (IOException e) {
            Thread.currentThread().interrupt();
        }
    }
}
