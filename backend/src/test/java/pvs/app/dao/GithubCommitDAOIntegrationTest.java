package pvs.app.dao;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import pvs.app.Application;
import pvs.app.entity.GithubCommit;

import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class GithubCommitDAOIntegrationTest {

    @Autowired
    private GithubCommitDAO githubCommitDAO;

    private final GithubCommit githubCommit01 = new GithubCommit();
    private final GithubCommit githubCommit02 = new GithubCommit();

    @Before
    public void setup() {
        githubCommit01.setRepoOwner("facebook");
        githubCommit01.setRepoName("react");
        githubCommit01.setAuthorEmail("test");
        githubCommit01.setAuthorName("test");
        githubCommit01.setCommittedDate(new Date());
        githubCommitDAO.save(githubCommit01);

        githubCommit02.setRepoOwner("angular");
        githubCommit02.setRepoName("angular");
        githubCommit02.setAuthorEmail("test");
        githubCommit02.setAuthorName("test");
        githubCommit02.setCommittedDate(new Date());
        githubCommitDAO.save(githubCommit02);
    }

    @Test
    public void whenFindByRepoOwnerAndRepoName_thenReturnGithubCommitList() {
        List<GithubCommit> foundEntityList = githubCommitDAO
                .findByRepoOwnerAndRepoName("facebook", "react");

        assertEquals(githubCommit01.getRepoOwner(), foundEntityList.get(0).getRepoOwner());
    }

    @Test
    public void whenFindFirstByRepoOwnerAndRepoNameOrderByCommittedDateDesc_thenReturnGithubCommit() {
        GithubCommit foundEntity =
                githubCommitDAO.findFirstByRepoOwnerAndRepoNameOrderByCommittedDateDesc("angular", "angular");

        assertEquals(githubCommit02.getCommittedDate(), foundEntity.getCommittedDate());
    }
}
