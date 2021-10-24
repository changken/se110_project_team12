package pvs.app.entity;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
public class Role implements GrantedAuthority {
    @Id
    @NotNull
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long roleId;

    @Column(unique=true)
    @NotNull
    private String name;

    @Override
    public String getAuthority() {
        return name;
    }
}
