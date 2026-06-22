const Grid = () => {
  return (
    <>
      <div className="flex justify-center w-screen overflow-x-hidden">
        {/* Main 2x2 Grid */}
        <div className="grid grid-cols-2 grid-rows-2 w-[700px] h-[700px] border-4 bg-black border-black gap-1">
          {/* Practice box 1 */}
          <div className="flex justify-start items-end bg-white h-full">
            <div className="p-10 bg-red-500"></div>
          </div>

          {/* Remaining 3 blocks of the main 2x2 grid */}
          <div className="bg-white"></div>
          <div className="bg-white"></div>
          <div className="bg-white"></div>
        </div>
      </div>
    </>
  );
};

export default Grid;





/*


Position                           | Change justify- (Horizontal) | Change items- (Vertical)
--------------------------------------------------------------------------------------------
Top Left                           | justify-start                | items-start
Top Center                         | justify-center               | items-start
Top Right                          | justify-end                  | items-start
Dead Center                        | justify-center               | items-center
Bottom Left (current setup)        | justify-start                | items-end
Bottom Center                      | justify-center               | items-end
Bottom Right                       | justify-end                  | items-end

*/



