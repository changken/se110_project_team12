package pvs.app.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pvs.app.entity.Project;

import java.util.List;

@Repository
public interface ProjectDAO extends CrudRepository<Project, Long> {
    List<Project> findAll();

    List<Project> findByMemberId(Long memberId);
}
