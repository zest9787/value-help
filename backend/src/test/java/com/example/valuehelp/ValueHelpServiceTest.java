package com.example.valuehelp;
import static org.junit.jupiter.api.Assertions.*;
import com.example.valuehelp.dto.*;
import com.example.valuehelp.registry.Registry;
import com.example.valuehelp.service.ValueHelpService;
import com.example.valuehelp.repository.mock.MockValueHelpRepository;
import com.example.valuehelp.odata.ODataFilterBuilder;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ValueHelpServiceTest {
 private final Registry registry=new Registry();
 private final ValueHelpService service=new ValueHelpService(registry,new MockValueHelpRepository());
 @Test void filtersDepartmentsByCompanyAndPagesResults(){
  Page page=service.search("DEPARTMENT",new SearchRequest(Map.of("companyCode","1000"),0,1,"departmentId","desc"));
  assertEquals(2,page.totalCount());assertEquals("D102",page.items().get(0).get("departmentId"));
  assertEquals("D101",service.search("DEPARTMENT",new SearchRequest(Map.of("companyCode","1000"),1,1,"departmentId","desc")).items().get(0).get("departmentId"));
 }
 @Test void rejectsUnknownFiltersAndResolvesItems(){
  assertThrows(IllegalArgumentException.class,()->service.search("EMPLOYEE",new SearchRequest(Map.of("unknown","x"),0,10,null,null)));
  assertThrows(IllegalArgumentException.class,()->service.search("EMPLOYEE",new SearchRequest(Map.of(),0,10,"unknown","asc")));
  assertEquals("김민수",service.item("EMPLOYEE","10001").get("employeeName"));
 }
 @Test void escapesOdataStringLiterals(){assertEquals("contains(EmployeeName,'O''Brien')",new ODataFilterBuilder().build(registry.get("EMPLOYEE"),Map.of("employeeName","O'Brien")));}
}
