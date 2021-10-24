package pvs.app.dao;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import pvs.app.Application;
import pvs.app.entity.Project;
import pvs.app.entity.Role;

import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class RoleDAOIntegrationTest {
    @Autowired
    private RoleDAO roleDAO;

    Role userRole;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);

        userRole = new Role();
        userRole.setName("ROLE");
        roleDAO.save(userRole);
    }
        @Test
    public void whenFindByName_thenReturnRole() {
        Role foundEntity = roleDAO.findByName("ROLE");
        assertEquals("ROLE", foundEntity.getName());
    }
}
