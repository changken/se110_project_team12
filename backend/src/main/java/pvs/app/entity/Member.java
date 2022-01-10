package pvs.app.entity;

import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
@Entity
public class Member implements UserDetails {
    @Id
    @NotNull
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long memberId;

    @Column(unique=true)
    @NotNull
    private String username;

    @NotNull
    private String password;

    @ManyToMany(cascade = { CascadeType.ALL },fetch=FetchType.EAGER)
    @JoinTable(
            name = "member_role",
            joinColumns = { @JoinColumn(name = "member_id") },
            inverseJoinColumns = { @JoinColumn(name = "role_id") }
    )
    private Set<Role> authorities;

    /**
     * 使用者帳號是否過期
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 使用者帳號是否鎖定
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 使用者密碼是否過期
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 使用者是否可用
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
