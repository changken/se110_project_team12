package pvs.app.service.impl;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pvs.app.dao.MemberDAO;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    static final Logger logger = LogManager.getLogger(UserDetailsServiceImpl.class.getName());

    private final MemberDAO memberDAO;

    UserDetailsServiceImpl(MemberDAO memberDAO) {
        this.memberDAO = memberDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) {
        try {
            return memberDAO.findByUsername(userName);
        } catch (UsernameNotFoundException e) {
            logger.debug(e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
