package pvs.app.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import pvs.app.Application;
import pvs.app.dao.MemberDAO;
import pvs.app.dto.MemberDTO;
import pvs.app.entity.Member;
import pvs.app.entity.Role;

import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class MemberServiceTest {
    @Autowired
    private MemberService memberService;

    @MockBean
    private RoleService mockRoleService;

    @MockBean
    private MemberDAO mockMemberDAO;

    private final Member member01 = new Member();
    private final MemberDTO member01DTO = new MemberDTO();
    private final Role userRole = new Role();

    @Before
    public void setup() {
        member01.setMemberId(1L);
        member01.setUsername("user");
        member01.setPassword("1234");

        member01DTO.setId(1L);
        member01DTO.setUsername("user");
        member01DTO.setPassword("1234");

        userRole.setRoleId(1L);
        userRole.setName("USER");
    }

    @Test
    public void get() {
        //context
        when(mockMemberDAO.findById(1L))
                .thenReturn(member01);
        //when
        MemberDTO memberDTO = memberService.get(1L);

        //then
        assertEquals(member01DTO.toString(), memberDTO.toString());
        verify(mockMemberDAO, times(1)).findById(1L);
    }

    @Test
    public void createUser() {
        //context
        when(mockRoleService.getByName("USER"))
                .thenReturn(userRole);
        when(mockMemberDAO.save(any(Member.class))).thenReturn(member01);

        //when
        MemberDTO memberDTO = memberService.createUser(member01DTO);
        //then
        assertEquals(member01DTO.toString(), memberDTO.toString());
    }

}
