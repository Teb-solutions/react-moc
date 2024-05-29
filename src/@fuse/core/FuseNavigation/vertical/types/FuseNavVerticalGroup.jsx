import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { alpha, styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useMemo } from 'react';
import { ListItem, ListItemText } from '@mui/material';
import FuseNavItem from '../../FuseNavItem';

const Root = styled(ListItem)(({ theme, ...props }) => ({
	minminHeight: 44,
	width: '100%',
	borderRadius: '6px',
	margin: '28px 0 0 0',
	paddingRight: 16,
	paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
	paddingTop: 10,
	paddingBottom: 10,
	color: alpha(theme.palette.text.primary, 0.7),
	fontWeight: 600,
	letterSpacing: '0.025em'
}));

/**
 * FuseNavVerticalGroup is a component used to render a group of navigation items in a vertical layout.
 */
function FuseNavVerticalGroup(props) {
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;
	const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;
	const component = item.url ? NavLinkAdapter : 'li';
	let itemProps = {};

	if (typeof component !== 'string') {
		itemProps = {
			disabled: item.disabled,
			to: item.url,
			end: item.end,
			role: 'button'
		};
	}

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	return useMemo(
		() => (
			item.children.map((_item) => (
							<FuseNavItem
								key={_item.id}
								type={`vertical-${_item.type}`}
								item={_item}
								nestedLevel={nestedLevel}
								onItemClick={onItemClick}
								checkPermission={checkPermission}
							/>
						))
		),
		[item, itempadding, nestedLevel, onItemClick]
	);
}

const NavVerticalGroup = FuseNavVerticalGroup;
export default NavVerticalGroup;
