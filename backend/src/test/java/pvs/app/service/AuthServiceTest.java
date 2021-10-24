package pvs.app.service;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.DigestUtils;
import pvs.app.Application;
import pvs.app.entity.Member;
import pvs.app.entity.Role;
import pvs.app.utils.JwtTokenUtil;

import java.io.IOException;
import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class AuthServiceTest {

    @Autowired
    AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    private Member member;

    @Before
    public void setup() throws IOException {
        this.authService = new AuthService(authenticationManager,
                userDetailsService, jwtTokenUtil);

        member = new Member();
        Role userRole = new Role();
        userRole.setRoleId(1L);
        userRole.setName("USER");

        member.setMemberId(1L);
        member.setUsername("test");
        member.setPassword(DigestUtils.md5DigestAsHex(String.valueOf("test").getBytes()));
        member.setAuthorities(Set.of(userRole));
    }

    @Test
    public void login() {
        //given
        UserDetails userDetails = member;
        Mockito.when(userDetailsService.loadUserByUsername("test")).thenReturn(userDetails);
        Mockito.when(jwtTokenUtil.generateToken(userDetails)).thenReturn("this is jwtToken");
        //when
        String jwtTocken = authService.login("test", "test");
        //then
        Assert.assertEquals("this is jwtToken", jwtTocken);
    }
}
