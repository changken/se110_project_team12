package pvs.app.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Data
public class ResponseProjectDTO {
    Long projectId;
    String projectName;
    String avatarURL;
    List<RepositoryDTO> repositoryDTOList = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResponseProjectDTO that = (ResponseProjectDTO) o;
        return Objects.equals(projectId, that.projectId) &&
                Objects.equals(projectName, that.projectName) &&
                Objects.equals(avatarURL, that.avatarURL) &&
                Objects.equals(repositoryDTOList, that.repositoryDTOList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectId, projectName, avatarURL, repositoryDTOList);
    }
}
