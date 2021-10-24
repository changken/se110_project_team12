package pvs.app.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Project {
    @Id
    @NotNull
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long projectId;

    @NotNull
    private Long memberId;

    @NotNull
    private String name;

    @NotNull
    private String avatarURL = "https://avatars3.githubusercontent.com/u/17744001?u=038d9e068c4205d94c670d7d89fb921ec5b29782&v=4";

    @ManyToMany(cascade = { CascadeType.ALL },fetch=FetchType.EAGER)
    @JoinTable(
            name = "project_repository",
            joinColumns = { @JoinColumn(name = "project_id") },
            inverseJoinColumns = { @JoinColumn(name = "repository_id") }
    )
    private Set<Repository> repositorySet = new HashSet<>();

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatarURL() {
        return avatarURL;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public Set<Repository> getRepositorySet() {
        return repositorySet;
    }

    public void setRepositorySet(Set<Repository> repositorySet) {
        this.repositorySet = repositorySet;
    }
}
