export const SearchResult = ({ result }) => {
  return (
    <div
      className='search-result px-5 py-2.5 hover:bg-[#efefef] flex items-center cursor-pointer gap-2'
      onClick={(e) => alert(`You selected ${result.UserName}!`)}
    >
      <img src={result.Avatar} className='h-6 w-6 sm:h-9 sm:w-9 rounded-full' alt='avatar' />
      {result.UserName}
    </div>
  )
}
