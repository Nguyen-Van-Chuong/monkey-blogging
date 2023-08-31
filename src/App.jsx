import { AuthProvider } from "./contexts/auth-context";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
// import CategoryAddNew from "module/category/CategoryAddNew";
// import CategoryManage from "module/category/CategoryManage";
// import CategoryPage from "pages/CategoryPage";
// import CategoryUpdate from "module/category/CategoryUpdate";
// import DashboardLayout from "module/dashboard/DashboardLayout";
// import DashboardPage from "pages/DashboardPage";
// import NotFoundPage from "pages/NotFoundPage";
// import PostAddNew from "module/post/PostAddNew";
// import PostDetailsPage from "pages/PostDetailsPage";
// import PostManage from "module/post/PostManage";
// import PostUpdate from "module/post/PostUpdate";
// import SignInPage from "pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";
// import UserAddNew from "module/user/UserAddNew";
// import UserManage from "module/user/UserManage";
// import UserProfile from "module/user/UserProfile";
// import UserUpdate from "module/user/UserUpdate";
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("pages/CategoryPage"));
const DashboardPage = lazy(() => import("pages/DashboardPage"));
const SignInPage = lazy(() => import("pages/SignInPage"));
const PostDetailsPage = lazy(() => import("pages/PostDetailsPage"));
const PageNotFound = lazy(() => import("pages/PageNotFound"));
const UserUpdate = lazy(() => import("module/user/UserUpdate"));
const UserAddNew = lazy(() => import("module/user/UserAddNew"));
const UserManage = lazy(() => import("module/user/UserManage"));
const UserProfile = lazy(() => import("module/user/UserProfile"));
const PostAddNew = lazy(() => import("module/post/PostAddNew"));
const PostManage = lazy(() => import("module/post/PostManage"));
const PostUpdate = lazy(() => import("module/post/PostUpdate"));
const CategoryAddNew = lazy(() => import("module/category/CategoryAddNew"));
const CategoryManage = lazy(() => import("module/category/CategoryManage"));
const CategoryUpdate = lazy(() => import("module/category/CategoryUpdate"));
const DashboardLayout = lazy(() => import("module/dashboard/DashboardLayout"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/sign-up" element={<SignUpPage />}></Route>
            <Route path="/sign-in" element={<SignInPage />}></Route>
            <Route path="*" element={<PageNotFound />}></Route>
            <Route
              path="category/:slug"
              element={<CategoryPage></CategoryPage>}
            ></Route>
            <Route
              path="/:slug"
              element={<PostDetailsPage></PostDetailsPage>}
            ></Route>
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              ></Route>
              <Route
                path="/manage/category"
                element={<CategoryManage></CategoryManage>}
              ></Route>
              <Route
                path="/manage/add-category"
                element={<CategoryAddNew></CategoryAddNew>}
              ></Route>
              <Route
                path="/manage/update-category"
                element={<CategoryUpdate></CategoryUpdate>}
              ></Route>
              <Route
                path="/manage/user"
                element={<UserManage></UserManage>}
              ></Route>
              <Route
                path="/manage/profile"
                element={<UserProfile></UserProfile>}
              ></Route>
              <Route
                path="/manage/add-user"
                element={<UserAddNew></UserAddNew>}
              ></Route>
              <Route
                path="/manage/update-user"
                element={<UserUpdate></UserUpdate>}
              ></Route>
              <Route
                path="/manage/add-post"
                element={<PostAddNew></PostAddNew>}
              ></Route>
              <Route
                path="/manage/post"
                element={<PostManage></PostManage>}
              ></Route>
              <Route
                path="/manage/update-post"
                element={<PostUpdate></PostUpdate>}
              ></Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
