package pvs.app.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import pvs.app.Application;
import pvs.app.dao.RoleDAO;
import pvs.app.dto.RoleDTO;
import pvs.app.entity.Role;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class RoleServiceTest {

    @Autowired
    private RoleService roleService;

    @MockBean
    private RoleDAO roleDAO;

    Role role;
    RoleDTO roleDTO;

    @Before
    public void setup() {
        role = new Role();
        role.setRoleId(1L);
        role.setName("USER");

        roleDTO = new RoleDTO();
        roleDTO.setId(1L);
        roleDTO.setName("USER");
    }

    @Test
    public void save() {
        Mockito.when(roleDAO.save(any(Role.class))).thenReturn(role);

        assertEquals("USER", roleService.save(roleDTO).getName());
    }

    @Test
    public void getByName() {
        Mockito.when(roleDAO.findByName("USER")).thenReturn(role);

        assertEquals(role, roleService.getByName("USER"));
    }
}
