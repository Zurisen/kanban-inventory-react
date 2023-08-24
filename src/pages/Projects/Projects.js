import Column from '../../components/Projects/Column';
import { firestore } from '../../cloud/firebase';

export const Projects = ({stateColors}) => {

  const categoryColorTuples = Object.keys(stateColors).map((category) => {
    return [category, stateColors[category]];
  });

  return (
      <div className=" flex p-4 bg-slate-200 dark:bg-slate-900">

        {categoryColorTuples.map(([category, color], index) => (
          <div className="p-2 py-5 bg-slate-200 dark:bg-slate-900" key={index}>
            <Column col={category} colIndex={index} columnColor={color} />
          </div>
        ))}

      </div> 
)
}

export default Projects;