package pvs.app.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import pvs.app.entity.Member;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil implements Serializable {
    private static final String CLAIM_KEY_USERNAME = "sub";

    /**
     * 5天(毫秒)
     */
    private static final long EXPIRATION_TIME = 432000000;
    /**
     * JWT密碼
     */
    private static final String SECRET = "secret";

    /**
     * 簽發JWT
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>(16);
        claims.put( CLAIM_KEY_USERNAME, userDetails.getUsername() );

        return Jwts.builder()
                .setClaims( claims )
                .setExpiration( new Date( Instant.now().toEpochMilli() + EXPIRATION_TIME  ) )
                .signWith( SignatureAlgorithm.HS512, SECRET )
                .compact();
    }

    /**
     * 驗證JWT
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        Member member = (Member) userDetails;
        String username = getUsernameFromToken( token );

        return (username.equals( member.getUsername() ) && !isTokenExpired( token ));
    }

    /**
     * 獲取token是否過期
     */
    public Boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken( token );
        return expiration.before( new Date() );
    }

    /**
     * 根據token獲取username
     */
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken( token ).getSubject();
    }

    /**
     * 獲取token的過期時間
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken( token ).getExpiration();
    }

    /**
     * 解析JWT
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey( SECRET )
                .parseClaimsJws( token )
                .getBody();
    }

}
