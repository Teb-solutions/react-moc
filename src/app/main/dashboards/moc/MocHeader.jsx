import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button } from '@mui/material';

/**
 * The DemoHeader component.
 */
function MocHeader(props) {

	function handleClick() {}

	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
			<div>
				<Breadcrumbs
					separator={<FuseSvgIcon size={20}>heroicons-solid:chevron-right</FuseSvgIcon>}
					aria-label="breadcrumb"
				>
					<Link
						className="font-medium hover:underline"
						key="1"
						color="inherit"
						to="/dashboards/project"
                        style={{ textDecoration: 'none' }}
					>
						Home
					</Link>
					<Typography
						className="font-medium"
						key="3"
						color="text.primary"
					>
						MOC Requests
					</Typography>
				</Breadcrumbs>

				<div className="flex sm:hidden" />
			</div>
            <div className="flex flex-1 items-center justify-end space-x-8">
					<Button
						className=""
						variant="contained"
						color="secondary"
						to="/apps/e-commerce/products/new"
					>
						<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
						<span className="mx-4 sm:mx-8">Add</span>
					</Button>
			</div>
		</div>
	);
}

export default MocHeader;
