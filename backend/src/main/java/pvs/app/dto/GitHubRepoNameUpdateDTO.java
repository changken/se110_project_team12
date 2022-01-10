package pvs.app.dto;

import lombok.Data;

@Data
public class GitHubRepoNameUpdateDTO {
    private String token;
    private String beforeName;
    private String AfterName;
}
