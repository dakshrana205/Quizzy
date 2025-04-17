import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
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
    getExams();
  }, []);

  return (
    user && (
      <div className="p-4">
        <PageTitle title={`Hi ${user.name}, Welcome to Quizzy`} />
        <div className="divider"></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={6} key={exam._id}>
              <div className="card-lg flex flex-col gap-1 p-4 h-full">
                <h1 className="text-xl md:text-2xl mb-2">{exam?.name}</h1>

                <div className="flex-grow">
                  <h1 className="text-sm md:text-md mb-1">Category : {exam.category}</h1>
                  <h1 className="text-sm md:text-md mb-1">Total Marks : {exam.totalMarks}</h1>
                  <h1 className="text-sm md:text-md mb-1">Passing Marks : {exam.passingMarks}</h1>
                  <h1 className="text-sm md:text-md mb-3">Duration : {exam.duration}</h1>
                </div>

                <button
                  className="primary-outlined-btn w-full mt-auto"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
