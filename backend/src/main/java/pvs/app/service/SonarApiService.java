package pvs.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pvs.app.dto.BugDTO;
import pvs.app.dto.CodeCoverageDTO;
import pvs.app.dto.CodeSmellDTO;
import pvs.app.dto.DuplicationDTO;

import java.io.IOException;
import java.util.*;

@Service
@SuppressWarnings("squid:S1192")
public class SonarApiService {

    static final Logger logger = LogManager.getLogger(SonarApiService.class.getName());

    private final WebClient webClient;

    private final DateTimeFormatter isoParser;

    public SonarApiService(WebClient.Builder webClientBuilder, @Value("${webClient.baseUrl.sonar}") String baseUrl) {
        String token = System.getenv("PVS_SONAR_TOKEN");
        this.webClient = webClientBuilder.baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
        isoParser = ISODateTimeFormat.dateTimeNoMillis().withLocale(Locale.TAIWAN);
    }

    public List<CodeCoverageDTO> getSonarCodeCoverage(String component) throws IOException {
        String responseJson = Objects.requireNonNull(this.webClient.get()
                .uri("/measures/search_history?component=" + component + "&metrics=coverage")
                .exchange()
                .block())
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        List<CodeCoverageDTO> coverages = new ArrayList<>();
        Optional<JsonNode> coverageJsonNodes = Optional.ofNullable(mapper.readTree(responseJson))
                .map(resp -> resp.get("measures"));

        if(coverageJsonNodes.isPresent()) {
            JsonNode coverageArrayNode = coverageJsonNodes.get().get(0).get("history");

            if(coverageArrayNode.isArray()) {
                for(final JsonNode jsonNode : coverageArrayNode) {

                    Date date =
                            isoParser.parseDateTime(jsonNode.get("date").textValue().replace("\"", ""))
                                    .toDate();
                    double coverageValue = 0;
                    if(null != jsonNode.get("value")) {
                        coverageValue = jsonNode.get("value").asDouble();
                    }
                    coverages.add(new CodeCoverageDTO(date, coverageValue));
                }
            }
        }
        return coverages;
    }

    public List<BugDTO> getSonarBug(String component) throws IOException {
        String responseJson = Objects.requireNonNull(this.webClient.get()
                .uri("/measures/search_history?component=" + component + "&metrics=bugs")
                .exchange()
                .block())
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        List<BugDTO> bugList = new ArrayList<>();
        Optional<JsonNode> bugJsonNodes = Optional.ofNullable(mapper.readTree(responseJson))
                .map(resp -> resp.get("measures"));

        if(bugJsonNodes.isPresent()) {
            JsonNode bugArrayNode = bugJsonNodes.get().get(0).get("history");

            if(bugArrayNode.isArray()) {
                for(final JsonNode jsonNode : bugArrayNode) {
                    Date date =
                            isoParser.parseDateTime(jsonNode.get("date").textValue().replace("\"", ""))
                                    .toDate();
                    int bugValue = 0;
                    if(null != jsonNode.get("value")) {
                        bugValue = jsonNode.get("value").asInt();
                    }
                    bugList.add(new BugDTO(date, bugValue));
                }
            }
        }
        return bugList;
    }

    public List<CodeSmellDTO> getSonarCodeSmell(String component) throws IOException {
        String responseJson = Objects.requireNonNull(this.webClient.get()
                .uri("/measures/search_history?component=" + component + "&metrics=code_smells")
                .exchange()
                .block())
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        List<CodeSmellDTO> codeSmellList = new ArrayList<>();
        Optional<JsonNode> codeSmellJsonNodes = Optional.ofNullable(mapper.readTree(responseJson))
                .map(resp -> resp.get("measures"));

        if(codeSmellJsonNodes.isPresent()) {
            JsonNode codeSmellArrayNode = codeSmellJsonNodes.get().get(0).get("history");
            if(codeSmellArrayNode.isArray()) {
                for(final JsonNode jsonNode : codeSmellArrayNode) {
                    Date date =
                            isoParser.parseDateTime(jsonNode.get("date").textValue().replace("\"", ""))
                                    .toDate();
                    int codeSmellValue = 0;
                    if(null != jsonNode.get("value")) {
                        codeSmellValue = jsonNode.get("value").asInt();
                    }
                    codeSmellList.add(new CodeSmellDTO(date, codeSmellValue));
                }
            }
        }
        return codeSmellList;
    }

    public List<DuplicationDTO> getDuplication(String component) throws IOException {
        String responseJson = Objects.requireNonNull(this.webClient.get()
                .uri("/measures/search_history?component=" + component + "&metrics=duplicated_lines_density")
                .exchange()
                .block())
                .bodyToMono(String.class)
                .block();

        ObjectMapper mapper = new ObjectMapper();
        List<DuplicationDTO> duplicationList = new ArrayList<>();
        Optional<JsonNode> duplicationJsonNodes = Optional.ofNullable(mapper.readTree(responseJson))
                .map(resp -> resp.get("measures"));

        if(duplicationJsonNodes.isPresent()) {
            JsonNode duplicationArrayNode = duplicationJsonNodes.get().get(0).get("history");
            if(duplicationArrayNode.isArray()) {
                for(final JsonNode jsonNode : duplicationArrayNode) {
                    Date date =
                            isoParser.parseDateTime(jsonNode.get("date").textValue().replace("\"", ""))
                                    .toDate();
                    double duplicationValue = 0;
                    if(null != jsonNode.get("value")) {
                        duplicationValue = jsonNode.get("value").asDouble();
                    }
                    duplicationList.add(new DuplicationDTO(date, duplicationValue));
                }
            }
        }
        return duplicationList;
    }
}