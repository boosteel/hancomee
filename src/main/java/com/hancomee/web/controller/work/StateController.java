package com.hancomee.web.controller.work;

import com.hancomee.util.DB;
import com.hancomee.util.SQL;
import com.hancomee.web.controller.support.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("hancomee/state")
public class StateController {

    @Autowired
    _WorkCommon workCommon;

    @Autowired
    DB workDB;

    @RequestMapping("get")
    @ResponseBody
    public Object get() throws Exception {

        /*
         *  갯수가 0일 경우에는 결과컬럼이 생략된다.
         *  따라서 배열 기본값을 0으로 모두 잡아놓은 상태에서 state값을 배열 인덱스로 취한다.
         *  결국 생략되는 결과는 0으로 집계되는 형태다.
         */
        return workDB.execute("SELECT state, COUNT(*) v FROM hancomee_work GROUP BY state", (rs) -> {
            int[] result = {0,0,0,0,0,0,0};
            while(rs.next())  {
                result[ rs.getInt("state")] = rs.getInt("v");
            }

            return result;
        });
    }

}
