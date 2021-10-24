package pvs.app.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.DigestUtils;
import org.springframework.web.cors.CorsConfiguration;
import pvs.app.filter.JwtTokenFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    static final Logger logger = LogManager.getLogger(SecurityConfig.class.getName());

    @Qualifier("userDetailsServiceImpl")
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) {

        //校驗使用者
        try {
            auth.userDetailsService(userDetailsService).passwordEncoder( new PasswordEncoder() {
                //對密碼進行加密
                @Override
                public String encode(CharSequence charSequence) {
                    return DigestUtils.md5DigestAsHex(charSequence.toString().getBytes());
                }
                //對密碼進行判斷匹配
                @Override
                public boolean matches(CharSequence charSequence, String s) {
                    String encode = DigestUtils.md5DigestAsHex(charSequence.toString().getBytes());

                    return s.equals( encode );
                }
            } );
        } catch (Exception e) {
            logger.debug(e);
            e.printStackTrace();
        }
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues())
                .and().csrf().disable()
                //因為使用JWT，所以不需要HttpSession
                .sessionManagement().sessionCreationPolicy( SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                //OPTIONS請求全部放行
                .antMatchers( HttpMethod.OPTIONS, "/**").permitAll()
                //登入介面放行
                .antMatchers("/auth/login").permitAll()
                .antMatchers(HttpMethod.POST, "/member").permitAll()
                .antMatchers("/project/**", "/github/**", "/sonar/**").hasAuthority("USER");

        //使用自定義的 Token過濾器 驗證請求的Token是否合法
        http.addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
        http.headers().cacheControl();
    }

    @Bean
    public JwtTokenFilter authenticationTokenFilterBean() {
        return new JwtTokenFilter();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
}
