export default async function handler(request, response) {
  try {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        // 将接收到的数据解析为 JSON 对象
        const requestBody = JSON.parse(body);
        // 验证请求体是否包含 number 字段
        if (!requestBody.number) {
          return response.status(400).json({ error: '请求体必须包含 number 字段' });
        }
        let numberStr;
        // 如果 number 是数字，则先转换为字符串
        if (typeof requestBody.number === 'number') {
          numberStr = requestBody.number.toString();
        } else {
          numberStr = requestBody.number;
        }
        // 验证 number 字段是否为字符串且仅包含数字
        if (typeof numberStr !== 'string' || !/^[0-9]+$/.test(numberStr)) {
          return response.status(400).json({ error: '数据格式不正确，number 字段必须是数字字符串' });
        }
        // 尝试将字符串转换为 BigInt
        const number = BigInt(numberStr);
        // 检查数字是否为偶数
        const isEven = (number % BigInt(2n) === BigInt(0n));
        // 返回结果
        response.status(200).json({ message: isEven ? '偶数' : '奇数' });
      } catch (parseError) {
        console.error("JSON 解析错误:", parseError);
        response.status(400).json({ error: '请求体格式不正确' });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ error: `服务器内部错误: ${error.message}` });
  }
}