import React, { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import { Imessage } from "../interface/message";

const Chatbot = () => {
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  // const [completionId, setCompletionId] = useState(null);
  const [models, setModels] = useState<any>([]);
  const [currentModel, setCurrentModel] = useState(models[0]);
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    sendMessage("Hello, how can I help you today?");
    getModels();
  }, []);

  const getModels = async () => {
    const listedModels = await openai.listModels();
    setModels(listedModels.data.data);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    sendMessage(inputValue);
    setInputValue("");
  };

  const sendMessage = async (text: string) => {
    setMessages([...messages, { text, isUser: true }]);
    const response: any = await openai.createCompletion({
      prompt: text,
      model: currentModel ? currentModel : "text-davinci-003",
      temperature: 0.5,
      max_tokens: 2048,
    });
    const responseText = response.data?.choices[0].text;
    setMessages((prev) => {
      return [...prev, { text: responseText, isUser: false }];
    });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentModel(e.target.value);
  };

  return (
    <>
      <div
        style={{
          margin: "auto",
          width: "100%",
          fontStyle: "bold",
          textAlign: "center",
          fontSize: "1.5rem",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        Custom ChatGPT
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          border: "1px solid black",
          margin: "auto",
          width: "50%",
        }}
      >
        <div>
          <select
            style={{ width: "100%", padding: "1rem" }}
            defaultValue={currentModel}
            onChange={handleSelect}
          >
            {models.map((model: any) => {
              return <option key={model.id}>{model.id}</option>;
            })}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            height: "50vh",
            overflowY: "scroll",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                backgroundColor: message.isUser ? "lightblue" : "lightgreen",
                padding: "1rem",
              }}
            >
              {message.isUser ? "You: " : "Bot: "}
              {message.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            padding: "1rem",
            margin: "auto",
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            style={{ width: "50%", padding: "0.8rem" }}
          />
          <button
            type="submit"
            style={{
              width: "20%",
              outline: "none",
              border: "none",
              background: "lightblue",
              padding: "1rem",
              marginLeft: "1rem",
            }}
          >
            Send
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setMessages([]);
            }}
            style={{
              width: "20%",
              outline: "none",
              border: "none",
              background: "#ddd",
              padding: "1rem",
              marginLeft: "1rem",
            }}
          >
            Clear
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
