package pvs.app.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pvs.app.entity.GithubCommit;

import java.util.List;

@Repository
public interface GithubCommitDAO extends CrudRepository<GithubCommit, Long> {
    List<GithubCommit> findByRepoOwnerAndRepoName(String repoOwner, String repoName);
    GithubCommit findFirstByRepoOwnerAndRepoNameOrderByCommittedDateDesc(String repoOwner, String repoName);
}
