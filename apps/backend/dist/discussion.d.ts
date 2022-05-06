declare namespace Nusmods {
    type SemesterData = {
        semester: 2;
        examDate: "2019-05-02T01:00:00.000Z";
        examDuration: 120;
    };
    type Module = {
        acadYear: string;
        preclusion: string;
        fulfillRequirements: string;
        description: string;
        title: string;
        department: string;
        faculty: string;
        workload: string;
        moduleCredit: string;
        moduleCode: string;
        attributes: string;
        semesterData: string;
    };
}
declare namespace Modtree {
    type Module = {
        acadYear: string;
        preclusion: string;
        fulfillRequirements: string;
        description: string;
        title: string;
        moduleCode: string;
        semesterData: string;
    };
}
