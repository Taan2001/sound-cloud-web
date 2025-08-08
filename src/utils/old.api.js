import queryString from "query-string";

export const sendRequestJS = async (props) => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOptions = {},
  } = props;

  const options = {
    method: method,
    headers: new Headers({
      "Content-Type": "application/json",
      ...headers,
    }),
    body: body ? JSON.stringify(body) : null,
    ...nextOptions,
  };
  if (useCredentials) {
    options.credentials = "include";
  }
  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((json) => {
        return {
          statusCode: response.status,
          message: json.message ?? "An error occurred",
          error: json.error ?? "Unknown error",
        };
      });
    }
  });
};
