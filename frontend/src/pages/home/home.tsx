import { useForm, type SubmitHandler } from "react-hook-form"
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/style.css'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login" },
  ];
}

type Input = {
  email: string
  password: string
}

// Export logout function for use in other components
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

export default function Home() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Input>()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user role
      axios.get('http://localhost:3000/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        const userRole = response.data.user_role;
        // Redirect based on role
        switch (userRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'คณบดี':
            navigate('/dean');
            break;
          case 'รองคณบดีฝ่ายวิชาการ':
            navigate('/vice-dean/academic');
            break;
          case 'รองคณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร':
            navigate('/vice-dean/strategy');
            break;
          case 'รองคณบดีฝ่ายวิจัยและนวัตกรรม':
            navigate('/vice-dean/discipline');
            break;
          case 'รองคณบดีฝ่ายคุณภาพนิสิต':
            navigate('/vice-dean/student-quality');
            break;
          case 'พนักงาน':
          default:
            navigate('/user');
        }
      })
      .catch(() => {
        // If token is invalid, remove it
        localStorage.removeItem('token');
      });
    }
  }, [navigate]);

  const dataSubmit: SubmitHandler<Input> = async (data) => {
    try {
      console.log('Sending login request...');
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: data.email,
        password: data.password
      });

      console.log('Login response:', response.data);

      // Access the nested access_token
      const token = response.data.access_token?.access_token;
      if (token) {
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Fetch user data using the token
        const userResponse = await axios.get('http://localhost:3000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('User data:', userResponse.data);
        
        // Get user role from response
        const userRole = userResponse.data.user_role;
        console.log('User role:', userRole);
        
        // Redirect based on role
        switch (userRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'คณบดี':
            navigate('/dean');
            break;
          case 'รองคณบดีฝ่ายวิชาการ':
            navigate('/vice-dean/academic');
            break;
          case 'รองคณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร':
            navigate('/vice-dean/strategy');
            break;
          case 'รองคณบดีฝ่ายวิจัยและนวัตกรรม':
            navigate('/vice-dean/discipline');
            break;
          case 'รองคณบดีฝ่ายคุณภาพนิสิต':
            navigate('/vice-dean/student-quality');
            break;
          case 'พนักงาน':
          default:
            navigate('/user');
        }
      } else {
        console.error('No access token in response');
        alert('Login failed: No access token received');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Login failed. Please try again.');
      }
    }
  }

  return (
    <>
      <div className="wrapper">
        <h1>Support Staff Workload System</h1>
        <p id="error-message"></p>
        <form id="form" onSubmit={handleSubmit(dataSubmit)}>
          <div>
            <label>
              <span>@</span>
            </label>
            <input
              type="text"
              {...register("email")}
              name="email"
              id="email-input"
              placeholder="Email"
            />
          </div>
          <div>
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"
                />
              </svg>
            </label>
            <input
              type="password"
              {...register("password")}
              name="password"
              id="password-input"
              placeholder="Password"
            />
          </div>
          <button type="submit">เข้าสู่ระบบ</button>
        </form>
        <p>เข้าสู่ระบบผ่าน <a href="/api/google">google</a></p>
      </div>
    </>
  )
}

