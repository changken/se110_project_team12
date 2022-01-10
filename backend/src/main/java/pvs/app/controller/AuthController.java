package pvs.app.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pvs.app.dto.MemberDTO;
import pvs.app.service.AuthService;

@RestController
public class AuthController {

    static final Logger logger = LogManager.getLogger(AuthController.class.getName());

    @Autowired
    private AuthService authService;
    /**
     * 登入
     */
    @PostMapping(value = "/auth/login")
    public String login( @RequestBody MemberDTO memberDTO ) {
        // 登入成功會發還 Token 給使用者
        return authService.login(memberDTO.getUsername(), memberDTO.getPassword());
    }
}
