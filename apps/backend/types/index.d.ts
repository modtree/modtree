export namespace Nusmods {
  export type SemesterData = {
    semester: 2;
    examDate: "2019-05-02T01:00:00.000Z";
    examDuration: 120;
  };

  export type Module = {
    acadYear: string;
    preclusion: string;
    fulfillRequirements: string;
    description: string | null;
    title: string;
    department: string;
    faculty: string;
    workload: string;
    moduleCredit: string;
    moduleCode: string;
    attributes: string;
    prereqTree: string;
    semesterData: string;
  };
}

// given data
export interface Metadata  {
  description: string;
  acadYear: string;
  title: string;
}

// our DB
interface Module {
  preclusion: string;
  fulfillRequirements: string;
  moduleCode: string;
  semesterData: string;
  id: string // unique to year, sem, module code
}
