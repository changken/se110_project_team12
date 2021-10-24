package pvs.app.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pvs.app.dto.MemberDTO;
import pvs.app.service.MemberService;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class MemberController {
    static final Logger logger = LogManager.getLogger(MemberController.class.getName());

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/member")
    public ResponseEntity<String> createMember(@RequestBody MemberDTO memberDTO) {
        try{
            if(null != memberService.createUser(memberDTO)) {
                return ResponseEntity.status(HttpStatus.OK).body("新建使用者成功");
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("新建使用者失敗");
            }
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("你去死吧");
        }
    }

}
