package pvs.app.dto;

import lombok.Data;

@Data
public class AddGithubRepositoryDTO {
    private Long projectId;
    private String repositoryURL;
}
