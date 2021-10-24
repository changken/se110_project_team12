package pvs.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pvs.app.dto.BugDTO;
import pvs.app.dto.CodeCoverageDTO;
import pvs.app.dto.CodeSmellDTO;
import pvs.app.dto.DuplicationDTO;
import pvs.app.service.SonarApiService;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class SonarApiController {

    @Value("${message.exception}")
    private String exceptionMessage;

    @Value("${message.fail}")
    private String failMessage;

    static final Logger logger = LogManager.getLogger(SonarApiController.class.getName());
    private final SonarApiService sonarApiService;

    public SonarApiController(SonarApiService sonarApiService) {
        this.sonarApiService = sonarApiService;
    }

    @GetMapping("/sonar/{component}/coverage")
    public ResponseEntity<String> getCoverage(@PathVariable("component") String component) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<CodeCoverageDTO> coverages = sonarApiService.getSonarCodeCoverage(component);
            if(!coverages.isEmpty()) {
                String coverageString = objectMapper.writeValueAsString(coverages);

                return ResponseEntity.status(HttpStatus.OK)
                        .body(coverageString);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(failMessage);
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exceptionMessage);
        }
    }

    @GetMapping("/sonar/{component}/bug")
    public ResponseEntity<String> getBug(@PathVariable("component") String component) throws IOException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<BugDTO> bugList = sonarApiService.getSonarBug(component);
            if(!bugList.isEmpty()) {
                String bugListString = objectMapper.writeValueAsString(bugList);

                return ResponseEntity.status(HttpStatus.OK)
                        .body(bugListString);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(failMessage);
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exceptionMessage);
        }
    }

    @GetMapping("/sonar/{component}/code_smell")
    public ResponseEntity<String> getCodeSmell(@PathVariable("component") String component) throws IOException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<CodeSmellDTO> codeSmellList = sonarApiService.getSonarCodeSmell(component);
            if(!codeSmellList.isEmpty()) {
                String codeSmellListString = objectMapper.writeValueAsString(codeSmellList);

                return ResponseEntity.status(HttpStatus.OK)
                        .body(codeSmellListString);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(failMessage);
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exceptionMessage);
        }
    }

    @GetMapping("/sonar/{component}/duplication")
    public ResponseEntity<String> getDuplication(@PathVariable("component") String component) throws IOException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<DuplicationDTO> duplicationList = sonarApiService.getDuplication(component);
            if(!duplicationList.isEmpty()) {
                String duplicationListString = objectMapper.writeValueAsString(duplicationList);

                return ResponseEntity.status(HttpStatus.OK)
                        .body(duplicationListString);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(failMessage);
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exceptionMessage);
        }
    }
}
