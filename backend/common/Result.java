

import lombok.Data;
import java.io.Serializable;

@Data
public class Result<T> implements Serializable {
    private int code;
    private String msg;
    private T data;
    
    public static <T> Result<T> success(T data) {
        return null;
    }
    
    private void setCode(int i) {
    }
    
    public static <T> Result<T> success() {
        return success(null);
    }
    
    public static <T> Result<T> error(String msg) {
        Result<T> result = new Result<>();
        result.setCode(500);
        result.setMsg(msg);
        return result;
    }
}
