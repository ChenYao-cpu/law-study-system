

import com.lawstudy.common.Result;
import com.lawstudy.entity.StudyRecord;
import com.lawstudy.service.StudyService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study")
public class StudyController {
    
    @Resource
    private StudyService studyService;
    
    @PostMapping("/record")
    public Result<Void> recordStudy(@RequestBody StudyRecord record) {
        studyService.recordStudy(record);
        return Result.success();
    }
    
    @GetMapping("/overview")
    public Result<Map<String, Object>> getOverview(@RequestParam Long userId) {
        return Result.success(studyService.getStudyOverview(userId));
    }
    
    @GetMapping("/progress")
    public Result<List<Map<String, Object>>> getProgress(@RequestParam Long userId) {
        return Result.success(studyService.getCourseProgress(userId));
    }
    
    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats(@RequestParam Long userId) {
        return Result.success(studyService.getStudyStats(userId));
    }
}

