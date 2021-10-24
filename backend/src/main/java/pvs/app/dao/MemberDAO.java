package pvs.app.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pvs.app.entity.Member;

@Repository
public interface MemberDAO extends CrudRepository<Member, Long> {
    Member findByUsername(String username);
    Member findById(long id);
}
