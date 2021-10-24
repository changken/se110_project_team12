package pvs.app.service;

import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import pvs.app.dto.RoleDTO;
import pvs.app.entity.Member;
import pvs.app.dto.MemberDTO;
import pvs.app.dao.MemberDAO;
import pvs.app.entity.Role;

import java.util.HashSet;
import java.util.Set;

@Service
public class MemberService {

    private final MemberDAO memberDAO;
    private final RoleService roleService;

    MemberService(MemberDAO memberDAO, RoleService roleService) {
        this.memberDAO = memberDAO;
        this.roleService = roleService;
    }

    public MemberDTO createUser(MemberDTO memberDTO) {
        Set<Role> roleSet = new HashSet<>();
        Member member = new Member();
        String encodePassword = DigestUtils.md5DigestAsHex(memberDTO.getPassword().getBytes());

        member.setUsername(memberDTO.getUsername());
        member.setPassword(encodePassword);

        Role userRole = roleService.getByName("USER");

        if (userRole == null) {
            RoleDTO roleDTO = new RoleDTO();
            roleDTO.setName("USER");
            roleService.save(roleDTO);
            userRole = roleService.getByName("USER");
        }

        if(userRole != null) {
            roleSet.add(userRole);
            member.setAuthorities(roleSet);
        }

        Member savedMember = memberDAO.save(member);
        memberDTO.setId(savedMember.getMemberId());
        return memberDTO;
    }

    public MemberDTO get(long id) {
        Member member = memberDAO.findById(id);
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setId(member.getMemberId());
        memberDTO.setUsername(member.getUsername());
        memberDTO.setPassword(member.getPassword());
        return memberDTO;
    }
}
