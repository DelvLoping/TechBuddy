const Button = ({ children, loading = false, className, ...props }) => {
  return (
    <button
      {...props}
      className={`${className} ${loading && '!bg-gray-300 !cursor-default'} ${
        props.disabled && '!bg-gray-300 !cursor-default'
      }`}
      disabled={loading}
    >
      {children}
    </button>
  );
};

export default Button;
