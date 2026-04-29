import * as React from "react";

const ErrorMessage: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="text-destructive">{children}</div>;
};

export class ErrorBoundary extends React.Component {
  declare state: { hasError: boolean; text: string };
  declare props: { children: React.ReactNode; fallback?: React.FC };
  declare ErrorMessage: React.FC<React.PropsWithChildren>;

  constructor(props) {
    super(props);
    this.state = { hasError: false, text: "" };
    this.ErrorMessage = this.props.fallback ?? ErrorMessage;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, text: error.message };
  }

  // componentDidCatch(error, info) {
  //   // logErrorToMyService(
  //   //   error,
  //   //   // Example "componentStack":
  //   //   //   in ComponentThatThrows (created by App)
  //   //   //   in ErrorBoundary (created by App)
  //   //   //   in div (created by App)
  //   //   //   in App
  //   //   info.componentStack,
  //   //   // Warning: `captureOwnerStack` is not available in production.
  //   //   React.captureOwnerStack(),
  //   // );
  //   // console.log(error, info);
  // }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorMessage>{this.state.text}</ErrorMessage>;
    }

    return this.props.children;
  }
}
