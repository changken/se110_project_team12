package pvs.app.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pvs.app.dto.GithubLoginDTO;
import pvs.app.utils.JwtTokenUtil;

import java.util.*;

@Service
public class AuthService {

    static final Logger logger = LogManager.getLogger(AuthService.class.getName());

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

    private final JwtTokenUtil jwtTokenUtil;
	
    private final WebClient webClient;
	
    private final String url = "https://github.com";
	
    private final String clientId = "";
	
    private final String clientSecret = "";	

    AuthService(AuthenticationManager authenticationManager,
                @Qualifier("userDetailsServiceImpl")UserDetailsService userDetailsService,
                JwtTokenUtil jwtTokenUtil,
				WebClient.Builder webClientBuilder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
		this.webClient = webClientBuilder
                .baseUrl(url)
                .build();		
    }

    public String login(String username, String password) {
        UsernamePasswordAuthenticationToken upToken = new UsernamePasswordAuthenticationToken( username, password );
        Authentication authentication = authenticationManager.authenticate(upToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtTokenUtil.generateToken(userDetails);
    }
	
    public String authenticateGithub(GithubLoginDTO dto) {

        Map<String, String> reqParameters = new HashMap<>();
        reqParameters.put("clientId", clientId);
        reqParameters.put("clientSecret", clientSecret);
        reqParameters.put("code", dto.getCode());

        String response = webClient.post()
                .uri("/login/oauth/access_token?client_id={clientId}&client_secret={clientSecret}&code={code}", reqParameters)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (!Objects.requireNonNull(response).isEmpty()) {
            Optional<String> accessToken = Arrays.stream(response.split("&")).filter(x -> x.contains("access_token")).findFirst();
            if (accessToken.isPresent()) {
                return accessToken.get().replace("access_token=", "");
            }
        }

        throw new RuntimeException("Error Code");
    }	
}
