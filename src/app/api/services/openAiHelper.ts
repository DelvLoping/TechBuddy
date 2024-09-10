import OpenAI from 'openai';
import { getEncoding } from 'js-tiktoken';

const encoding = getEncoding('cl100k_base');

const contexteGlobal = {
  role: 'system',
  content: `Your name is Buddy, you are a digital assistance chatbot designed specifically to help elderly individuals. Your main goal is to provide friendly, clear, and helpful support tailored to the needs and challenges faced by older adults.
    
    You must only respond to questions or requests that fall under the domain of information technology (IT), which includes tasks such as troubleshooting devices, managing software, explaining digital concepts, or assisting with online services.
    
    Exception: You are allowed to respond to simple greetings like "hello", "hi", "goodbye", "thanks", and similar polite expressions. For any other topics unrelated to IT, kindly remind the user that you specialize in IT support.
    
    Always approach interactions with empathy and patience, understanding that users may need more time to process information or ask questions multiple times.
    
    Provide explanations in a clear and simple manner, avoiding technical jargon whenever possible.`
};
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const applySystemOnContext = (context) => {
  if (!context[0] || context[0].content !== contexteGlobal.content) {
    if (context[0]?.role === 'system') {
      context[0] = contexteGlobal;
    } else {
      context.unshift(contexteGlobal);
    }
  }
  return context;
};

const trimContextHistory = (context) => {
  if (context.length > 6) {
    context = context.slice(context.length - 6, context.length);
  }
  return context;
};

const calculateTokenUsage = (messages) => {
  let numTokens = 0;

  for (const message of messages) {
    numTokens += 4;
    for (const [key, value] of Object.entries(message)) {
      numTokens += encoding.encode(value).length;
      if (key === 'name') numTokens -= 1;
    }
  }

  numTokens += 2;

  return numTokens;
};

const handleTokenLimitExceeded = (tokenUsage) => {
  if (tokenUsage > 5000) {
    throw new Error('Token limit exceeded');
  }
};

async function callAPIOpenAI(userInput, context = []) {
  let updatedContext = context;

  updatedContext = trimContextHistory(updatedContext);
  updatedContext = applySystemOnContext(updatedContext);

  if (userInput) {
    const requestBody = {
      model: 'gpt-4o-mini-2024-07-18',
      messages: updatedContext,
      stop: null,
      stream: false
    };

    try {
      // Check token usage
      const tokenUsage = calculateTokenUsage(updatedContext);
      /**
       * const tokenPrice = 0.001;
       * console.log(tokenUsage, (tokenUsage / 1000) * tokenPrice + "$");
       * add here log for token usage
       */
      handleTokenLimitExceeded(tokenUsage);

      const response = await openai.chat.completions.create(requestBody);
      updatedContext.push(response.choices[0].message);
      return updatedContext;
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error('Prompt is empty');
  }
}

export { callAPIOpenAI };
