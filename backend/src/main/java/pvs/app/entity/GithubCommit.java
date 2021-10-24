package pvs.app.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Objects;

@Entity
@Data
public class GithubCommit {

    @Id
    @NotNull
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @NotNull
    private String repoOwner;

    @NotNull
    private String repoName;

    @NotNull
    private Date committedDate;

    @NotNull
    private int additions;

    @NotNull
    private int deletions;

    @NotNull
    private int changeFiles;

    @NotNull
    private String authorName;

    @NotNull
    private String authorEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="repository_id")
    private Repository repository;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GithubCommit that = (GithubCommit) o;
        return additions == that.additions &&
                deletions == that.deletions &&
                changeFiles == that.changeFiles &&
                id.equals(that.id) &&
                repoOwner.equals(that.repoOwner) &&
                repoName.equals(that.repoName) &&
                committedDate.equals(that.committedDate) &&
                authorName.equals(that.authorName) &&
                authorEmail.equals(that.authorEmail) &&
                repository.equals(that.repository);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, repoOwner, repoName, committedDate, additions, deletions, changeFiles, authorName, authorEmail, repository);
    }
}
