import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Modal, Table, Button } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";
import { generateQuizPDF } from "../../../utils/pdfGenerator";

function UserReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();

  const handleDownloadPDF = (record) => {
    try {
      console.log('Full record:', record);
      console.log('Exam data:', record.exam);
      console.log('Result data:', record.result);

      if (!record.exam) {
        throw new Error('Exam data is missing');
      }

      // Structure the quiz data properly
      const quizData = {
        name: record.exam.name,
        questions: record.exam.questions.map((question, index) => {
          console.log('Question data:', question);
          return {
            name: question.name || `Question ${index + 1}`,
            options: [
              question.optionA,
              question.optionB,
              question.optionC,
              question.optionD
            ].filter(option => option !== undefined && option !== null),
            correctOption: question.correctOption,
            selectedOption: record.result.userAnswers ? record.result.userAnswers[index] : -1
          };
        }),
        totalMarks: record.exam.totalMarks,
        passingMarks: record.exam.passingMarks,
        obtainedMarks: record.result.correctAnswers ? record.result.correctAnswers.length : 0,
        verdict: record.result.verdict || 'Not Available'
      };

      console.log('Structured quiz data:', quizData);
      const pdf = generateQuizPDF(quizData);
      pdf.save(`quiz-results-${record.exam.name}-${moment(record.createdAt).format('YYYY-MM-DD')}.pdf`);
      message.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      message.error('Failed to generate PDF: ' + error.message);
    }
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "exam",
      render: (exam) => <>{exam?.name || "N/A"}</>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) => (
        <>{moment(date).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "exam",
      render: (exam) => <>{exam?.totalMarks || "N/A"}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "exam",
      render: (exam) => <>{exam?.passingMarks || "N/A"}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "result",
      render: (result) => <>{result?.correctAnswers?.length || 0}</>,
    },
    {
      title: "Verdict",
      dataIndex: "result",
      render: (result) => <>{result?.verdict || "N/A"}</>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleDownloadPDF(record)}>
          Download PDF
        </Button>
      ),
    },
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <Table columns={columns} dataSource={reportsData} />
    </div>
  );
}

export default UserReports;
