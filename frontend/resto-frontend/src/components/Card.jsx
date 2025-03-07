export const Card = ({ title, description }) => {
    return (
      <div className="mb-4">
        <a href="#" className="block mx-auto max-w-sm p-12 bg-gray-100 border border-gray-200 rounded-lg shadow hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 m-10">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">{description}</p>
        </a>
      </div>
    );
  };
  