import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { email, password } = req.body;

  if (!email || !password) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: 'First or last name not found' })
  }

  // 发送请求获取登录页面
  const response = await axios.get('http://localhost:8080/login', { withCredentials: true })

  // 提取CSRF令牌的值
  const csrfToken = response.data.match(/<input name="_csrf" type="hidden" value="([^"]*)"/)[1];
  // 获取Cookie
  const cookies = response.headers?.['set-cookie'] ?? '';

  // 构造登录请求的数据
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  formData.append('_csrf', csrfToken || ''); // 避免 csrfToken 为 null 或 undefined

  // 发送第二个请求并携带cookie
  const loginResponse = await axios.post('http://localhost:8080/login', formData, {
    withCredentials: true,
    headers: {
      Cookie: cookies, // 携带cookie
      'X-XSRF-Token': csrfToken
    }
  })

  const login_cookies = loginResponse.headers?.['set-cookie'] ?? '';
  const jsessionid = login_cookies[1]?.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('JSESSIONID='))
    ?.split('=')[1];

  // 打印session令牌的值
  console.log('jsessionid:', jsessionid);
  setCookie("jwt", jsessionid, { req, res, maxAge: 60 * 6 * 24 });

  return res.status(200).json(loginResponse.data)

}
