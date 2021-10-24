package pvs.app.dto;

import lombok.Data;

@Data
public class AddSonarRepositoryDTO {
    private Long projectId;
    private String repositoryURL;
}
