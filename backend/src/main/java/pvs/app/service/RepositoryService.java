package pvs.app.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import pvs.app.dto.GitHubRepoNameUpdateDTO;
import pvs.app.dto.GitHubTokenDTO;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@SuppressWarnings("squid:S1192")
public class RepositoryService {
    private final WebClient webClient;
	private final WebClient webClient2;

    private final String token = System.getenv("PVS_GITHUB_TOKEN");

    static final Logger logger = LogManager.getLogger(RepositoryService.class.getName());
	
	final String url = "https://api.github.com";

    public RepositoryService(WebClient.Builder webClientBuilder, @Value("${webClient.baseUrl.test}") String baseUrl) {
        this.webClient = webClientBuilder.baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token )
                .build();
		this.webClient2 = webClientBuilder.baseUrl(url)
				.build();
    }

    public boolean checkGithubURL(String url) {
        if(!url.contains("github.com")){
            return false;
        }
        String targetURL = url.replace("github.com", "api.github.com/repos");
        AtomicBoolean result = new AtomicBoolean(false);

        this.webClient
                .get()
                .uri(targetURL)
                .exchange()
                .doOnSuccess(clientResponse ->
                    result.set(clientResponse.statusCode().equals(HttpStatus.OK))
                )
                .block();
        return result.get();
    }

    public boolean checkSonarURL(String url) {
        if(!url.contains("localhost")){
            return false;
        }

        String targetURL = url.replace("dashboard?id", "api/components/show?component");
        AtomicBoolean result = new AtomicBoolean(false);

        this.webClient
                .get()
                .uri(targetURL)
                .exchange()
                .doOnSuccess(clientResponse ->
                        result.set(clientResponse.statusCode().equals(HttpStatus.OK))
                )
                .block();
        return result.get();
    }
	
    public String listReposForTheOAuth(GitHubTokenDTO gitHubTokenDTO) {
        return webClient2.get()
                .uri("/user/repos")
                .header(HttpHeaders.AUTHORIZATION, String.format("token %s", gitHubTokenDTO.getToken()))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String UpdateARepo(GitHubRepoNameUpdateDTO gitHubRepoNameUpdateDTO) {
        Map<String, String> reqParameters = new HashMap<>();
        reqParameters.put("name", gitHubRepoNameUpdateDTO.getBeforeName());

        Map<String, String> reqBodys = new HashMap<>();
        reqBodys.put("name", gitHubRepoNameUpdateDTO.getAfterName());

        return webClient2.patch()
                .uri("/repos/xriza/{name}", reqParameters)
                .accept(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromObject(reqBodys))
                .header(HttpHeaders.AUTHORIZATION, String.format("token %s", gitHubRepoNameUpdateDTO.getToken()))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }	
}
