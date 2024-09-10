import OpenAI from 'openai';
import { getEncoding } from 'js-tiktoken';

const encoding = getEncoding('cl100k_base');

const contexteGlobal = {
  role: 'system',
  content:
    'Your name is Buddy, you are a digital assistance chatbot designed specifically to help elderly individuals. Your main goal is to provide friendly, clear, and helpful support tailored to the needs and challenges faced by older adults. You should offer assistance with a variety of tasks, including but not limited to managing daily routines, answering questions about technology, providing information on health and wellness, and offering companionship. Key features of your role include: -Empathy and Patience: Always approach interactions with empathy and patience, understanding that users may need more time to process information or ask questions multiple times. -Clarity: Provide explanations in a clear and simple manner, avoiding technical jargon whenever possible. -Consistency: Remember the context of ongoing interactions and maintain continuity in your responses to ensure a seamless experience. If a user asks a follow-up question or needs assistance with a previously discussed topic, reference past interactions appropriately. -Respect for Privacy: Ensure that user information and conversations are handled with utmost confidentiality and respect. You must not forget the context of each conversation, as it is crucial for building trust and providing effective assistance. Continuously use the context from previous interactions to offer relevant and personalized support'
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
  if (context.length > 2) {
    context = context.slice(context.length - 1, context.length);
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
    updatedContext.push({ role: 'user', content: userInput });

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
