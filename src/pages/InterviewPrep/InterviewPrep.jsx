import React from 'react'
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu"
// import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

import { toast } from "react-hot-toast";
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import QuestionCard from '../../components/Cards/QuestionCard';
import Drawer from '../../components/Loader/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';
import AIResponsePreview from './components/AIResponsePreview';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';


const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  //fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));

      if(response.data && response.data.session){
        setSessionData(response.data.session);
      }
    }catch(error){
      console.error("Error:", error);
    }
  };

  //Generate concept explanation
  const generateConceptExplanation = async (question) => {
    try{
      setErrorMsg("");
      setExplanation(null)
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );
      if(response.data){
        setExplanation(response.data);
      }
    }catch(error){
      setExplanation(null)
      setErrorMsg("Failed to generate explanation. Please try again.")
      console.error("Error:", error);
    }finally{
      setIsLoading(false);
    }
  }

  //Pin question
  const toggleQuestionPinStatus = async (questionId) => {
    try{
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );
      console.log(response);

      if(response.data && response.data.question){
        //toast.success('question pinned successfully')
        fetchSessionDetailsById();
      }
    }catch(error){
      console.log("Error", error);
    }
  };

  //Add more questions to a session
  const uploadMoreQuestions = async () => {
    try{
      setIsUpdateLoader(true);

      // Call AI API to generate questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTION,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicToFocus: sessionData?.topicToFocus || sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      )

      //should be array like [{question, answer}, ...]

      const generateQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generateQuestions,
        }
      )
      if(response.data){
        toast.success("Added more Q&A||");
        fetchSessionDetailsById();
      }
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setErrorMsg(error.response.data.message);
      }else{
        setErrorMsg("Something went wrong. Please try again.")
      }
    }finally{
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if(sessionId){
      fetchSessionDetailsById();
    }
    return () => {};
  }, []);


  return (
    <DashboardLayout>
      <RoleInfoHeader
      role={sessionData?.role || ""}
      topicsToFocus={sessionData?.topicToFocus || sessionData?.topicsToFocus || ""}
      experience={sessionData?.experience || "-"}
      questions={sessionData?.question?.length || ""}
      description={sessionData?.description || ""}
      lastUpdatedAt={
        sessionData?.updatedAt
        ? moment(sessionData.updatedAt).format("Do MMM YYYY")
        : ""
      }/>

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q and A</h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
          className={`col-span-12 ${
            openLearnMoreDrawer ? "md:col-span-7":"md:col-span-8"
          }`}>
            <AnimatePresence>
            {sessionData?.question?.map((data, index) => {
              return (
                <motion.div
                key={data._id || index}
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{
                  duration: 0.9,
                  type: "spring",
                  stiffness: 100,
                  dealy: index * 0.1,
                  damping: 15,
                }}
                layout //This is key prop that animates position change
                layoutId={`question-${data._id || index}`}  //helps framer tracks every item
                >
                  <>
                    <QuestionCard
                    question={data?.question}
                    answer={data?.answer}
                    onLearnMore={()=>
                      generateConceptExplanation(data.question)
                    }
                    isPinned={data?.isPinned}
                    onTogglePin={() => toggleQuestionPinStatus(data._id)}/>
                  

                  {!isLoading && 
                    sessionData?.question?.length == index + 1 && (
                      <div className="flex items-center justify-center mt-5">
                        <button className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                          disabled={ isLoading || isUpdateLoader}
                          onClick={uploadMoreQuestions}>
                           {isUpdateLoader ? (
                            <SpinnerLoader/>
                           ):(
                            <LuListCollapse className="text-lg"/>
                           )}{" "}
                           Load More
                        </button>
                      </div>
                    )}
                  </>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        </div>
        
        <div>
          <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={()=> setOpenLearnMoreDrawer(false)}
          title={!isLoading && explanation?.title}>
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1"/> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader/>}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation}/>
            )}
          </Drawer>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default InterviewPrep