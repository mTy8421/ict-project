import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home/home.tsx"),
  route('user', './routes/user/home.tsx'),
  route('user/work', './routes/user/work.tsx'),
  route('admin', './routes/admin/admin.tsx'),
] satisfies RouteConfig;
