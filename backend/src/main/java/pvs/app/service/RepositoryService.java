package pvs.app.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.concurrent.atomic.AtomicBoolean;

@Service
@SuppressWarnings("squid:S1192")
public class RepositoryService {
    private final WebClient webClient;

    private final String token = System.getenv("PVS_GITHUB_TOKEN");

    static final Logger logger = LogManager.getLogger(RepositoryService.class.getName());

    public RepositoryService(WebClient.Builder webClientBuilder, @Value("${webClient.baseUrl.test}") String baseUrl) {
        this.webClient = webClientBuilder.baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token )
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
}
